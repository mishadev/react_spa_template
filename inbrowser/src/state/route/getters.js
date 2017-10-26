import { get } from 'lodash'

export function getRoute(state) {
	return get(state, 'route')
}
export function getRouteSiteId (state) {
	return get(state, 'route.params.site_id')
}
export function getRouteName (state) {
	return get(state, 'route.name')
}
export function getRoutePath (state) {
	return get(state, 'route.path')
}
