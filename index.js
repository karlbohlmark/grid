var Emitter = require('emitter');
var delegates = require('delegates');
module.exports = Grid;

/*
 * Events: cellclick, rowclick
 * */
function Grid(el, collection, columns, options) {
  this.el = el;
  this.options = options;
  this.collection = collection;
  this.columns(columns);
  this.collection.on('change', this.render.bind(this));
  this.events = delegates(this.el, this);
  this.events.bind('click td', 'cellclick');
  this.events.bind('click th', 'headerclick');
  this.render();
}

Grid.prototype.name = 'karlbohlmark-grid';

Grid.prototype.editable = function () {
  this.isEditable = true;
  var cells = [].slice.call(this.el.querySelectorAll('td'));
};

Grid.prototype.sortableHeaderTemplate = '<th data-sortable><a href="#sort/#{name}">#{title}</a></th>';
Grid.prototype.headerTemplate = '<th>#{title}</th>';

Emitter(Grid.prototype);

Grid.prototype.cellclick = function (e) {
  console.log('cellclick');
};

Grid.prototype.headerclick = function (e) {
  console.log('cellclick');
};

Grid.prototype.columns = function (columns) {
  this.columns = columns;
  var grid = this;
  this.columns.forEach(function (col) {
    col.template = (col.sortable ? grid.sortableHeaderTemplate : grid.headerTemplate);
  });
  return this;
};

Grid.prototype.destroy = function () {
  this.el.addEventListener(ev, handler);
  return this;
};

Grid.prototype.render = function () {
  var grid = this;
  var header = this.header();
  var rows = this.collection.reduce(function (html, item) {
    return html + grid.row(item);
  }, '');
  this.el.innerHTML = header + rows;
};

Grid.prototype.header = function () {
  return this.columns.reduce(function (html, col) {
    return html + col.template
        .replace(/#\{title\}/, (col.title || col.name))
        .replace(/#\{name\}/, col.name);
  }, '<thead><tr>') + '</tr></thead>';
};

Grid.prototype.row = function (item) {
  return this.columns.reduce(function (html, col) {
    return html + '<td>' + item[col.name] + '</td>';
  }, '<tr>') + '</tr>';
};