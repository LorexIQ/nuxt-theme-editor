import ThemesList from '../components/views/ThemesList.vue';
import ThemeCreate from '../components/views/ThemeCreate.vue';
import ThemeDelete from '../components/views/ThemeDelete.vue';
import ThemeEditInfo from '../components/views/ThemeEditInfo.vue';
import ThemeEditStyles from '../components/views/ThemeEditStyles.vue';
import ThemeEditStylesCancel from '../components/views/ThemeEditStylesCancel.vue';
import ThemePublish from '../components/views/ThemePublish.vue';

export default [
  {
    name: 'index',
    title: '',
    component: ThemesList
  },
  {
    name: 'newTheme',
    title: 'New',
    component: ThemeCreate
  },
  {
    name: 'editThemeInfo',
    title: 'Edit Info',
    component: ThemeDelete
  },
  {
    name: 'editThemeStyles',
    title: 'Edit Styles',
    component: ThemeEditInfo
  },
  {
    name: 'deleteTheme',
    title: 'Delete',
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
  }
] as const;
