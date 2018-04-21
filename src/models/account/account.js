const account_schema = Wdb.schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

Account = mongoose.model('Account', account_schema);

module.exports = Account;
