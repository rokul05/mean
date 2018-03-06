'use strict';

class ReactCustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderImage = this.renderImage.bind(this);
  }

  renderImage(customer) {
 
    var referredClass = {
      'text-primary' : customer.referred,
      'text-pink':!customer.referred
    };


    if(customer.image) {

      var imageStyle = {
        height: '11vmax'
      };
      var iconStyle = {
        fontSize: '11vmax'
      };

      return (
        <img src={customer.image} style={imageStyle}/>
      )
    }
    else {

      return (
        <div>
        <i style={{fontSize: '11vmax'}} className={classNames('glyphicon', 'glyphicon-user', referredClass)}></i>
        </div>
      )
    }
  };


  render() {
   // var customer = this.props.customer;

   // var zoomRatio = this.props.zoomRatio || 1;
   // var pixelsPerPoint = 1 * zoomRatio;
/*
    var sheetStyle = {
      position: 'absolute',
      left: 10,
      top: 0
    };

    var layoutStyle = {
      position: 'absolute',
      left: 10,
      top: 0
    };

    var componentClass = {
      'customer-detail' : true
    };    

    var componentStyle = {
//      width: this.state.matrix.width + rulerXOffset,
//      height: this.state.matrix.height + rulerYOffset
    };

    var size;
    // Add CSS class for extra-small icon for special rendering
    var baseWidth = Math.min(icon.height, icon.width);

    if (baseWidth < 60)
    {
      size = 'xs';
    }

    if (size) {
      iconClass[size] = true;
    }
    
    var baseWidth = Math.min(icon.height, icon.width);
    var textSizeFactor = (size === 'xs' ? 0.5 : 0.3);
    
    var textStyle = {
      fontSize: Math.min(80, Math.round(0.8 * baseWidth * textSizeFactor)),
    };
    textStyle.width = Math.round(baseWidth * 2 * textSizeFactor);
    textStyle.height = Math.round(baseWidth * textSizeFactor);  

   // var customerName = customer.firstName + ' ' + customer.surname
*/
    //var created =moment(this.props.customers[0].created).format('DD-MMM-YY HH:mm:ss');
    //var created = this.props.customers[0].created;
    //console.log('REACT', this.props.customers);

    var utils = this.props.utils;
    var customer = this.props.customer;
    //moment.locale('en');
   // var created = customer.created;
    var created = customer.created;
    created = utils.getDate(created, 'mediumDate');

    return (
      <div className="list-group">
        <div className="col-xs-6 col-sm-4 extra-space">
          <a className="list-group-item">
            <h4 className="cust-list text-center">
              {this.renderImage(customer)}
            </h4>
            <div className="row">
              <div className="col-xs-10 col-xs-offset-1">
                <h4>{customer.firstName} {customer.surname}</h4>
                <small className="list-group-item-text text-muted">
                  <span>{created}</span>
                  <span className="pull-right">
                    <button className="btn btn-default btn-sm" onClick={this.props.onClick}>
                      <i className="glyphicon glyphicon-trash"></i>
                    </button>
                  </span>
                </small>
              </div>
            </div>
          </a>


        </div>
      </div>

    );
  }
}


ReactCustomerDetail.propTypes = {
  customer : React.PropTypes.object.isRequired,
  'onClick' : React.PropTypes.func,
  utils: React.PropTypes.object.isRequired
  //onClickIcon: React.PropTypes.func
};

CustomerDetail.$inject = ['reactDirective', 'utils'];

function CustomerDetail(reactDirective, utils) {
  return reactDirective(ReactCustomerDetail, undefined, {}, {
    utils: utils
 });
}

angular.module('customers').directive('utCustomerDetail', CustomerDetail);