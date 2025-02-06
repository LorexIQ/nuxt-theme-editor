import ThemeCreate from '../components/views/ThemeCreate.vue';
import ThemeDelete from '../components/views/ThemeDelete.vue';
import ThemeDepublish from '../components/views/ThemeDepublish.vue';
import ThemeEditConflict from '../components/views/ThemeEditConflict.vue';
import ThemeEditInfo from '../components/views/ThemeEditInfo.vue';
import ThemeEditStyles from '../components/views/ThemeEditStyles.vue';
import ThemeEditStylesCancel from '../components/views/ThemeEditStylesCancel.vue';
import ThemePublish from '../components/views/ThemePublish.vue';
import ThemesList from '../components/views/ThemesList.vue';

export default [
  {
    name: 'newTheme',
    title: 'New',
    component: ThemeCreate
  },
  {
    name: 'deleteTheme',
    title: 'Delete',
    component: ThemeDelete
  },
  {
    name: 'depublishApprove',
    title: 'Depublish Approve',
    component: ThemeDepublish
  },
  {
    name: 'editThemeConflict',
    title: 'Conflict',
    component: ThemeEditConflict
  },
  {
    name: 'editThemeInfo',
    title: 'Edit Info',
    component: ThemeEditInfo
  },
  {
    name: 'editThemeStyles',
    title: 'Edit Styles',
    component: ThemeEditStyles
  },
  {
    name: 'editThemeStylesCancel',
    title: 'Cancel Changes',
    component: ThemeEditStylesCancel
  },
  {
    name: 'publishApprove',
    title: 'Publish Approve',
    component: ThemePublish
  },
  {
    name: 'index',
    title: '',
    component: ThemesList
  }
] as const;
