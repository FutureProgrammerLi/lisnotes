import DefaultTheme from 'vitepress/theme'
import './custom.css'

DefaultTheme.enhanceApp = ({app,router,siteData}) => {
    router.onBeforeRouteChange = to => {
        if(typeof _hmt !== 'undefined'){ // object added by script
            _hmt.push(['_trackedPageview',to])
        }
    }
}
export default DefaultTheme