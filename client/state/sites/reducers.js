/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import {
	RECEIVE_SITE
} from './action-types';

/**
 * Tracks all known site objects, indexed by site ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function byId( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_SITE:
			state = Object.assign( {}, state, {
				[ action.site.ID ]: action.site
			} );
			break;
	}

	return state;
}

export default combineReducers( {
	byId
} );