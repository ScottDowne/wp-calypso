require( 'lib/react-test-env-setup' )();

/**
 * External dependencies
 */
import { expect } from 'chai';
import ReactDom from 'react-dom';
import React from 'react';

/**
 * Internal dependencies
 */
import RootChild from '../';

/**
 * Module variables
 */
const Greeting = React.createClass( {
	getDefaultProps: function() {
		return { toWhom: 'World' };
	},

	render: function() {
		return (
			<div className="parent">
				<h1 ref="parentChild">Greeting</h1>
				<RootChild { ...this.props.rootChildProps }>
					<span ref="rootChild">Hello { this.props.toWhom }!</span>
				</RootChild>
			</div>
		);
	}
} );

describe( 'RootChild', function() {
	var container;

	before( function() {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
	} );

	afterEach( function() {
		ReactDom.unmountComponentAtNode( container );
	} );

	describe( 'rendering', function() {
		it( 'should render any children as descendants of body', function() {
			var tree = ReactDom.render( React.createElement( Greeting ), container );

			expect( tree.refs.parentChild
				.parentNode.className
			).to.equal( 'parent' );

			expect( tree.refs.rootChild
				.parentNode
				.parentNode
			).to.eql( document.body );
		} );

		it( 'accepts props to be added to a wrapper element', function() {
			var tree = ReactDom.render( React.createElement( Greeting, {
				rootChildProps: { className: 'wrapper' }
			} ), container );

			expect( tree.refs.rootChild
				.parentNode
				.className )
			.to.equal( 'wrapper' );

			expect( tree.refs.rootChild
				.parentNode
				.parentNode
				.parentNode
			).to.eql( document.body );
		} );

		it( 'should update the children if parent is re-rendered', function() {
			var tree = ReactDom.render( React.createElement( Greeting ), container );
			tree.setProps( { toWhom: 'Universe' } );

			expect( tree.refs.rootChild
				.textContent
			).to.equal( 'Hello Universe!' );
		} );
	} );

	describe( 'unmounting', function() {
		it( 'should destroy the root child when the component is unmounted', function() {
			ReactDom.render( React.createElement( Greeting ), container );
			ReactDom.unmountComponentAtNode( container );

			expect( [].slice.call(
				document.body.querySelectorAll( '*' )
			) ).to.eql( [ container ] );
		} );
	} );
} );
