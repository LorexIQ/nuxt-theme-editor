import ThemeCreate from '../components/views/ThemeCreate.vue';
import ThemeDelete from '../components/views/ThemeDelete.vue';
import ThemeDepublish from '../components/views/ThemeDepublish.vue';
import ThemeEditConflict from '../components/views/ThemeEditConflict.vue';
import ThemeEditInfo from '../components/views/ThemeEditInfo.vue';
import ThemeEditStyles from '../components/views/ThemeEditStyles.vue';
import ThemeEditStylesCancel from '../components/views/ThemeEditStylesCancel.vue';
import ThemePublish from '../components/views/ThemePublish.vue';
import ThemesList from '../components/views/ThemesList.vue';
import useLang from '../helpers/useLang';

export default function () {
  return [
    {
      name: 'newTheme',
      title: useLang('pagesTitles.newTheme'),
      component: ThemeCreate
    },
    {
      name: 'deleteTheme',
      title: useLang('pagesTitles.deleteTheme'),
      component: ThemeDelete
    },
    {
      name: 'depublishApprove',
      title: useLang('pagesTitles.depublishApprove'),
      component: ThemeDepublish
    },
    {
      name: 'editThemeConflict',
      title: useLang('pagesTitles.editThemeConflict'),
      component: ThemeEditConflict
    },
    {
      name: 'editThemeInfo',
      title: useLang('pagesTitles.editThemeInfo'),
      component: ThemeEditInfo
    },
    {
      name: 'editThemeStyles',
      title: useLang('pagesTitles.editThemeStyles'),
      component: ThemeEditStyles
    },
    {
      name: 'editThemeStylesCancel',
      title: useLang('pagesTitles.editThemeStylesCancel'),
      component: ThemeEditStylesCancel
    },
    {
      name: 'publishApprove',
      title: useLang('pagesTitles.publishApprove'),
      component: ThemePublish
    },
    {
      name: 'index',
      title: '',
      component: ThemesList
    }
  ] as const;
}
