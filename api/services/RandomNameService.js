/**
 * Service
 */
module.exports = function () {
  var names = sails.config.names
  return names[Math.round(Math.random() * names.length)]
}