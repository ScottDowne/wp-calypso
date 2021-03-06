
/**
 * External dependencies
 */
var React = require( 'react' ),
	classNames = require( 'classnames' ),
	flatten = require( 'lodash/flatten' ),
	map = require( 'lodash/map' ),
	map = require( 'lodash/map' ),
	find = require( 'lodash/find' ),
	reject = require( 'lodash/reject' ),
	filter = require( 'lodash/filter' ),
	pick = require( 'lodash/pick' );

/**
 * Internal dependencies
 */
var steps = require( 'signup/config/steps' );

/**
 * Sorts the given steps in the roughly the order they will be processed.
 */
function sortSteps( progressSteps ) {
	var canonicalSteps = pick( steps, map( progressSteps, 'stepName' ) ),
		stepWithToken = find( canonicalSteps, { providesToken: true } ) || [],
		stepsWithoutDependencies = reject( canonicalSteps, function( step ) {
			return step.dependencies || step.providesToken;
		} ),
		stepsWithDependencies = filter( canonicalSteps, function( step ) {
			return step.dependencies && ! step.providesToken;
		} );

	return map( flatten( [ stepWithToken, stepsWithoutDependencies, stepsWithDependencies ] ), function( step ) {
		return find( progressSteps, { stepName: step.stepName } );
	} );
}

module.exports = React.createClass( {
	displayName: 'SignupProcessingScreen',

	showStep: function( step, index ) {
		var classes = classNames( {
			'signup-processing-screen__processing-step': true,
			'is-pending': step.status === 'pending',
			'is-processing': step.status === 'processing',
			'is-complete': step.status === 'completed'
		} );

		if ( ! step.processingMessage ) {
			return null;
		}

		return (
			<div className={ classes } key={ index }>
				{ step.processingMessage }
			</div>
		);
	},

	render: function() {
		var stepMarkup = map( sortSteps( this.props.steps ), this.showStep );

		return (
			<div>
				<div className="signup-processing-screen__processing-text">
					<div className="signup-processing-screen__processing-illustration"></div>
					<div className="signup-processing-screen__processing-step-heading">
						{ this.translate( 'Almost done!' ) }
					</div>
					{ stepMarkup }
					<div className="signup-processing-screen__loader">{ this.translate( 'Loading…' ) }</div>
				</div>
			</div>
		);
	}
} );
