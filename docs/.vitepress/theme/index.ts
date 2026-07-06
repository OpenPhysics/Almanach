import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import SceneryDemo from './components/SceneryDemo.vue';
import './scenery-demo.css';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp( { app } ) {
    app.component( 'SceneryDemo', SceneryDemo );
  }
};

export default theme;
