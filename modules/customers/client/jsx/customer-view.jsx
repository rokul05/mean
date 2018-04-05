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

    var self = this;
    var handleShowimage = function(event) {
      if (self.props.onShowimage) {
        self.props.onShowimage(customer);
      }
    };

    if(customer.image) {
      var imageStyle = {
        height: '11vmax',
        maxHeight: 120,
        cursor: 'pointer'
      };

      return (
        <img src={customer.image} style={imageStyle} onClick={handleShowimage} />
      )
    }
    else {

      return (
        <i className={classNames('glyphicon', 'glyphicon-user', referredClass)}></i>
      )
    }
  };


  render() {

    var utils = this.props.utils;
    var customer = this.props.customer;
    
    var created = customer.created;
    created = utils.getDate(created, 'mediumDate');

    var infoStyle = {
      height: 250,
      minWidth: 200
    };

    var rowStyle = {
      position: 'absolute',
      width: '100%',
      bottom: 15     
    };

    var self = this;

    var handleEdit = function(event) {
      if (self.props.onEdit) {
        self.props.onEdit(customer);
      }
    };

    var handleDuplicate = function(event) {
      if (self.props.onDuplicate) {
        self.props.onDuplicate(customer);
      }
    };

    var handleDelete = function(event) {
      if (self.props.onDelete) {
        self.props.onDelete(customer);
      }
    };


    return (
      <div className="list-group">
        <div className="col-xs-12 col-sm-6 col-lg-4 extra-space">
          <a className="list-group-item" style={infoStyle}>
            <h4 className="cust-list text-center">
              {this.renderImage(customer)}
            </h4>
            <div className="row" style={rowStyle}>
              <div className="col-xs-10 col-xs-offset-1">
                <h4>{customer.firstName} {customer.surname}</h4>
                <small className="list-group-item-text text-muted">
                  <div className="pull-left">{created}</div>
                  <div className="pull-right thumbnail-button-custom">
                    <button className="btn btn-xs btn-default" title="Edit the customer" onClick={handleEdit}><span className="glyphicon glyphicon-pencil"></span></button>
                    <button className="btn btn-xs btn-default" title="Duplicate the customer" onClick={handleDuplicate}><span className="glyphicon glyphicon-file"></span></button>
                    <button className="btn btn-xs btn-default" title="Delete the customer" onClick={handleDelete}><span className="glyphicon glyphicon-trash"></span></button>
                  </div>
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
  customer : React.PropTypes.object,
  onEdit : React.PropTypes.func,
  onDuplicate : React.PropTypes.func,
  onDelete : React.PropTypes.func,
  onShowimage : React.PropTypes.func,
  utils: React.PropTypes.object.isRequired
};

CustomerDetail.$inject = ['reactDirective', 'utils'];

function CustomerDetail(reactDirective, utils) {
  return reactDirective(ReactCustomerDetail, undefined, {}, {
    utils: utils
 });
}

angular.module('customers').directive('utCustomerDetail', CustomerDetail);