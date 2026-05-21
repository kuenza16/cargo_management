const Customer = require('../models/Customer');
const factory = require('./crudFactory');

exports.getCustomers = factory.getAll(Customer, 'userId');
exports.getCustomer = factory.getOne(Customer, 'userId');
exports.createCustomer = factory.createOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
