import type { Reactive, Ref } from 'vue';
import type { UnwrapRefSimple } from '@vue/reactivity';
import unwrap from './unwrap';
import { reactive, ref } from '#imports';

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
  private hideDelay: NodeJS.Timeout | undefined;

  constructor(config?: UseSwitchConfig) {
    this.config = this._initConfig(config);
    this.queue = reactive(this.config.defaultStatus ? [true] : []);
    this.status = ref(!!this.queue.length);

    this.minHideDelay = this.config.minSwitchStatusDelay;
    this.showTimeStamp = 0;
  }

  private _initConfig(config?: UseSwitchConfig): Required<UseSwitchConfig> {
    return {
      maxQueue: 1,
      defaultStatus: false,
      minSwitchStatusDelay: 500,

      ...config
    };
  }

  show(isAddInQueue: boolean = true) {
    if (isAddInQueue && this.queue.length < this.config.maxQueue)
      this.queue.push(true);
    this.showTimeStamp = !this.showTimeStamp ? Date.now() : this.showTimeStamp;
    clearTimeout(this.hideDelay);
    this.calculateComputedStatus(this.queue);
  }

  async hide() {
    this.queue.splice(0, 1);
    await this.calculateComputedStatus(this.queue);
  }

  async funcExec(func: () => any) {
    this.show();

    try {
      await func();
    } catch (e: any) {
      throw new Error(e.message);
    } finally {
      await this.hide();
    }
  }

  private async calculateComputedStatus(status: true[]) {
    if (!status.length) {
      await new Promise((resolve) => {
        this.hideDelay = setTimeout(() => {
          unwrap.set(this, 'status', false);
          this.showTimeStamp = 0;
          resolve(undefined);
        }, this.minHideDelay - (Date.now() - this.showTimeStamp));
      });
    } else {
      unwrap.set(this, 'status', true);
    }

    this.minHideDelay = this.config.minSwitchStatusDelay;
  }
}

export class _UseSwitch extends UseSwitch {}
export type UseSwitchClass = UnwrapRefSimple<UseSwitch>;

export default function (config?: UseSwitchConfig): UseSwitchClass {
  return reactive(new UseSwitch(config));
}
