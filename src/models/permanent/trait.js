const trait_schema = Wdb.schema({
  name:       String,
  desription: String,
  role:       String
});

Trait = mongoose.model('Trait', trait_schema);

module.exports = Trait;
