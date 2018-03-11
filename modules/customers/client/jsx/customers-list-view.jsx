'use strict';

class ReactCustomersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderCustomer = this.renderCustomer.bind(this);
  }

  renderCustomer(customer) {
  
    return (
        <ReactCustomerDetail 
          key={'customer:' + customer._id}
          customer={customer}
          onEdit={this.props.onEdit}
          onDuplicate={this.props.onDuplicate}
          onDelete={this.props.onDelete}
          utils={this.props.utils}>
        </ReactCustomerDetail>
      );
  };


  render() {

    var customers = _.clone(this.props.customers) || [ ];
    return (
      <div className="container">
        {
          customers.map(this.renderCustomer)
        }
      </div>
    );
  }
}


ReactCustomersView.propTypes = {
  customers : React.PropTypes.array,
  onEdit : React.PropTypes.func,
  onDuplicate : React.PropTypes.func,
  onDelete : React.PropTypes.func,
  utils: React.PropTypes.object.isRequired
};

CustomersView.$inject = ['reactDirective', 'utils'];

function CustomersView(reactDirective, utils) {
  return reactDirective(ReactCustomersView, undefined, {}, {
    utils: utils
 });
}

angular.module('customers').directive('utCustomersView', CustomersView);