(function() {
  'use strict';

  class HelloComponentReact extends React.Component {
    render() {
      var style = {
        borderStyle :'solid', 
        borderWidth :'2px', 
        'margin' : '10px'
      };

      return (
        <div style={style} onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
        <h1>Hello There, {this.props.firstName}</h1>
        </div>
      );
    }
  }

  HelloComponentReact.propTypes = {
    'firstName' : React.PropTypes.string.isRequired,
    'onClick' : React.PropTypes.func,
    'onMouseEnter' : React.PropTypes.func,
    'onMouseLeave' : React.PropTypes.func
  };

  angular.module('customers').value('HelloComponent', HelloComponentReact);

  'use strict';

  HelloComponent.$inject = ['reactDirective'];
  function HelloComponent(reactDirective) {
    return reactDirective('HelloComponent');
  }

  angular.module('customers').directive('utHelloComponent', HelloComponent);
})();
