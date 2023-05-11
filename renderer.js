/**
 * @typedef Template
 * @type {object}
 * @property {string} templateString - Template representado en un string.
 * @property {HTMLElement} element - Elemento dentro del cual se renderiza el contenido.
 */

// VARIABLES

/** Mapa donde se almacenan los templates.
 * @type {Map<string, Template>}
 */
const _templates = new Map()

// FUNCIONES INTERNAS

/**
 * Llena un template con los valores de las propiedades de un objeto
 * @param {string} template - Template a ser llenado.
 * @param {object} obj - Objeto que contiene la información con la que se llena el template.
 * @returns {string} Template lleno
 */
function _fill(template, obj) {
  // Obtener arreglo de pares clave-valor con entries() e iterar/procesar resultado con reduce()
  return Object.entries(obj).reduce((result, [name, value]) => {
    // En cada vuelta, reemplazar una variable en el template con su respectivo valor
    return result.replaceAll(`\${${name}}`, value)
  }, template)
}

// FUNCIONES PÚBLICAS

/**
 * Renderiza un template en la vista.
 * @param {string} templateName - Nombre del template a renderizar.
 * @param {object | object[]} obj - Objeto o arreglo que contiene la información con la que se llena el template.
 * @throws Lanza un error en caso de no encontrar el template.
 */
function render(templateName, obj) {
  // Inicializar resultado
  let templateResult = ''

  // Validar existencia de template
  if (!_templates.has(templateName)) throw new Error('Template not found')
  // Una vez comprobada la existencia, los atributos del objeto template
  const { templateString, element } = _templates.get(templateName)

  // Si hay contenido, continúa
  // si no, imprime un espacio vacío
  if (obj) {
    if (Array.isArray(obj))
      // En caso de ser un arreglo, iterar y acumular el resultado de cada objeto
      templateResult = obj.reduce((listResult, item, index) => {
        // Para cada objeto, inicializar un template sin llenar
        let itemResult = templateString
          // Reemplazar las variables auxiliares con los valores correspondientes
          .replaceAll('#{index}', index) // Índice del objeto (inicia en 0)
          .replaceAll('#{count}', index + 1) // Conteo de objetos (inicia en 1)
        // Llenar template con la información de cada objeto
        itemResult = _fill(itemResult, item)
        // Agregar template lleno al resultado general de la lista
        return listResult + itemResult
      }, '')
    else {
      // En caso de ser un objeto, reemplazar las variables por los valores correspondientes
      templateResult = _fill(templateString, obj)
    }
  }

  // Pintar resultado en pantalla
  element.innerHTML = templateResult
}

// INICIALIZACÓN

// Buscar todos los elementos con el atributo template
for (const element of document.querySelectorAll('[template]')) {
  // Obtener el elemento padre (los templates se insertan en él)
  const parentElement = element.parentElement
  // Obtener el nombre del template del valor del atributo template
  const templateName = element.getAttribute('template')
  // Eliminar el atributo antes de guardar el template
  element.removeAttribute('template')
  // Guardar el template como string
  const templateString = element.outerHTML

  // Guardar el objeto template en el mapa correpondiente
  _templates.set(templateName, {
    templateString: templateString,
    element: parentElement,
  })

  // Una vez registrado, se elimina el template de la vista
  element.remove()
}
