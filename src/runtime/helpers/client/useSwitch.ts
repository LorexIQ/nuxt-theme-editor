import type { Reactive, Ref, WatchHandle } from 'vue';
import unwrap from './unwrap';
import { reactive, ref, watch } from '#imports';

export type UseSwitchConfig = {
  maxQueue?: number;
  defaultStatus?: boolean;
  minSwitchStatusDelay?: number;
};

class UseSwitch {
  config: Required<UseSwitchConfig>;
  queue: Reactive<true[]>;
  status: Ref<boolean>;

  private minHideDelay: number;
  private showTimeStamp: number;
  private watcherForSync: WatchHandle | undefined;
  private hideDelay: NodeJS.Timeout | undefined;

  constructor(config?: UseSwitchConfig) {
    this.config = this._initConfig(config);
    this.queue = reactive(this.config.defaultStatus ? [true] : []);
    this.status = ref(!!this.queue.length);

    this.minHideDelay = this.config.minSwitchStatusDelay;
    this.showTimeStamp = 0;

    this._initWatchers();
  }

  private _initConfig(config?: UseSwitchConfig): Required<UseSwitchConfig> {
    return {
      maxQueue: 100,
      defaultStatus: false,
      minSwitchStatusDelay: 500,

      ...config
    };
  }

  private _initWatchers(): void {
    watch(this.queue, this.calculateComputedStatus.bind(this));
  }

  show(isAddInQueue: boolean = true) {
    if (isAddInQueue && this.queue.length < this.config.maxQueue)
      this.queue.push(true);
    this.showTimeStamp = !this.showTimeStamp ? Date.now() : this.showTimeStamp;
    clearTimeout(this.hideDelay);
    this.calculateComputedStatus.bind(this, this.queue)();
  }

  hide() {
    this.queue.splice(0, 1);
  }

  sync(obj: UseSwitchClass, delay?: number) {
    this.unSync.bind(this)();
    this.watcherForSync = watch(obj.status, (value) => {
      if (delay) this.minHideDelay = delay;
      if (value) {
        this.show();
      } else {
        this.hide();
      }
    }, { immediate: true });
  }

  unSync() {
    if (this.watcherForSync) this.watcherForSync();
  }

  private calculateComputedStatus(status: true[]) {
    if (!status.length) {
      this.hideDelay = setTimeout(() => {
        unwrap.set(this, 'status', false);
        this.showTimeStamp = 0;
      }, this.minHideDelay - (Date.now() - this.showTimeStamp));
    } else {
      unwrap.set(this, 'status', true);
    }

    this.minHideDelay = this.config.minSwitchStatusDelay;
  }
}

export class _UseSwitch extends UseSwitch {}
export type UseSwitchClass = UseSwitch;

export default function (config?: UseSwitchConfig): UseSwitchClass {
  return new UseSwitch(config);
}
