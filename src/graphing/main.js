const d3 = require('d3')

const Main = function (projects) {
  var page
  var self = {}

  self.init = function () {
    page = d3
      .select('body')
      .append('div')
      .attr('id', 'main')
    return self
  }

  self.plot = function () {
    plotHeader()
  }

  function plotHeader () {
    header = page.insert('header', '#radar')
    header
      .append('div')
      .attr('class', 'radar-title')
      .append('div')
      .attr('class', 'radar-title__text')
      .append('h1')
      .text('tech radars')
      .style('cursor', 'pointer')

    header
      .select('.radar-title')
      .append('div')
      .attr('class', 'radar-title__logo')
      .html('<a href="https://www.thoughtworks.com"> <img src="/images/logo.png" alt="" /> </a>')

    const buttonsGroup = header
      .append('div')
      .classed('buttons-group', true)

    projects.forEach((projectName) => plotProjectButton(buttonsGroup, projectName))

    return header
  }

  function plotButtonGroup () {
  }

  function plotProjectButton (content, name) {
    content
      .append('a')
      .attr('class', `button${name === 'iOS' ? ' no-capitalize' : ''}`)
      .attr('href', `${window.location.origin}/${name}`)
      .text(name)
  }

  return self
}

module.exports = Main
