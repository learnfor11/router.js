import { createContext, useContext, useState } from 'react'
import { $, useMount } from '@ppzp/utils.rc'

const RouterContext = createContext()

export
function Router({ routes }) {
  const [route, setRoute] = useState(location.pathname)

  const [routes_map] = useState(() => { // 初始化 path => route 的映射
    const map = new Map()
    for(const route of routes)
      map.set(route.path, route)
    return map
  })

  useMount(function() { // 监听浏览器前进后退
    window.addEventListener('popstate', function() {
      // console.debug('[router mini] listen popstate')
      setRoute(location.pathname)
    })
  })

  return $(RouterContext.Provider,
    {
      value: {
        route,
        setRoute(route) {
          history.pushState({}, '', route) // 更新浏览器地址栏
          setRoute(route) // 更新 Context
        }
      }
    },
    
    routes_map.get(route).element
  )
}

export
function Link({ className, to, target, children }) {
  const { setRoute } = useContext(RouterContext)
  return $.a(
    {
      className,
      href: to,
      target,
      onClick(e) {
        e.preventDefault()
        // console.debug('[router mini] click link')
        setRoute(to)
      }
    },
    children
  )
}

export
function useRoute() {
  return useContext(RouterContext).route
}
