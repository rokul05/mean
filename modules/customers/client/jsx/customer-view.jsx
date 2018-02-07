class ReactCustomerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    var customer = this.props.customer;

    if (!customer.containers || customer.containers.length === 0) {
      return (
        <div className={'customer-view empty'} style={{width: 1, height: 1}}>
        </div>
      );
    }

    var zoomRatio = this.props.zoomRatio || 1;
    var pixelsPerPoint = 1 * zoomRatio;

    var sheetStyle = {
      position: 'absolute',
      left: rulerXOffset,
      top: 0
    };

    var layoutStyle = {
      position: 'absolute',
      left: rulerXOffset,
      top: 0
    };

    var componentClass = {
      'customer-view' : true
    };    

    var componentStyle = {
//      width: this.state.matrix.width + rulerXOffset,
//      height: this.state.matrix.height + rulerYOffset,
    };


    return (
      <div className={classNames(componentClass)} style={componentStyle}>
        <div style={sheetStyle}>
          <ReactCustomerSheet
            customer={this.props.customer}>
            </ReactCustomerSheet>
        </div>
      </div>
    );
  }
}


ReactCustomerView.propTypes = {
  customer: React.PropTypes.object.isRequired,
  zoomRatio: React.PropTypes.number, // later
  onClickIcon: React.PropTypes.func
 ;

CustomerView.$inject = ['reactDirective', 'Presets'];
function CustomerView(reactDirective, presets) {
  return reactDirective(ReactCustomerView, undefined, {}, {
    presets: presets,
 });
}

angular.module('customers').directive('utCustomerView', CustomerView);