import { is } from 'bpmn-js/lib/util/ModelUtil';

import React, { Component } from 'react';

import './PropertiesView.css';

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

export default class PropertiesView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedElements: [],
      element: null
    };
  }

  componentDidMount() {

    const {
      modeler
    } = this.props;

    modeler.on('selection.changed', (e) => {

      const {
        element
      } = this.state;

      this.setState({
        selectedElements: e.newSelection,
        element: e.newSelection[0]
      });
    });


    modeler.on('element.changed', (e) => {

      const {
        element
      } = e;

      const {
        element: currentElement
      } = this.state;

      if (!currentElement) {
        return;
      }

      if (element.id === currentElement.id) {
        this.setState({
          element
        });
      }

    });
  }

  render() {

    const {
      modeler
    } = this.props;

    const {
      selectedElements,
      element
    } = this.state;

    function downloadAsPDF() {
      html2canvas(document.querySelector('#modeler-container')).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 150); 
        pdf.save('bpmn-diagram.pdf'); 
      });
    }
    return (
      <div>
      <div style={{ marginBottom: '1em' }}>
      <button style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#1976d2', color: 'white' }} onClick={downloadAsPDF}>
  📄 Download Diagram as PDF
</button>
      </div>
        {
          selectedElements.length === 1
            && <ElementProperties modeler={ modeler } element={ element } />
        }

        {
          selectedElements.length === 0
            && <span>Please Select An Element</span>
        }

        {
          selectedElements.length > 1
            && <span>Please select a single element.</span>
        }


      </div>
    );
  }

}


function ElementProperties(props) {

  let {
    element,
    modeler
  } = props;

  if (element.labelTarget) {
    element = element.labelTarget;
  }

  function updateName(name) {
    const modeling = modeler.get('modeling');

    modeling.updateLabel(element, name);
  }

  function updateTopic(topic) {
    const modeling = modeler.get('modeling');

    modeling.updateProperties(element, {
      'custom:topic': topic
    });
  }

  function makeMessageEvent() {

    const bpmnReplace = modeler.get('bpmnReplace');

    bpmnReplace.replaceElement(element, {
      type: element.businessObject.$type,
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    });
  }

  function makeServiceTask(name) {
    const bpmnReplace = modeler.get('bpmnReplace');

    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask'
    });
  }

  function attachTimeout() {
    const modeling = modeler.get('modeling');
    const autoPlace = modeler.get('autoPlace');
    const selection = modeler.get('selection');

    const attrs = {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    };

    const position = {
      x: element.x + element.width,
      y: element.y + element.height
    };

    const boundaryEvent = modeling.createShape(attrs, position, element, { attach: true });

    const taskShape = append(boundaryEvent, {
      type: 'bpmn:Task'
    });

    selection.select(taskShape);
  }

  function isTimeoutConfigured(element) {
    const attachers = element.attachers || [];

    return attachers.some(e => hasDefinition(e, 'bpmn:TimerEventDefinition'));
  }

  function append(element, attrs) {

    const autoPlace = modeler.get('autoPlace');
    const elementFactory = modeler.get('elementFactory');

    var shape = elementFactory.createShape(attrs);

    return autoPlace.append(element, shape);
  };

  return (
    <div className="element-properties" key={ element.id }>
      {/* <fieldset>
        <label>id</label>
        <span>{ element.id }</span>
      </fieldset> */}

      {/* <fieldset>
        <label>name</label>
        <input value={ element.businessObject.name || '' } onChange={ (event) => {
          updateName(event.target.value)
        } } />
      </fieldset> */}

      {/* {
        is(element, 'custom:TopicHolder') &&
          <fieldset>
            <label>topic (custom)</label>
            <input value={ element.businessObject.get('custom:topic') } onChange={ (event) => {
              updateTopic(event.target.value)
            } } />
          </fieldset>
      } */}

      <fieldset>
        <label>Actions</label>

        {
          is(element, 'bpmn:Task') && !is(element, 'bpmn:ServiceTask') &&
            <button onClick={ makeServiceTask }>Make Service Task</button>
        }

        {
          is(element, 'bpmn:Event') && !hasDefinition(element, 'bpmn:MessageEventDefinition') &&
            <button onClick={ makeMessageEvent }>Make Message Event</button>
        }

        {
          is(element, 'bpmn:Task') && !isTimeoutConfigured(element) &&
            <button onClick={ attachTimeout }>Attach Timeout</button>
        }
      </fieldset>
    </div>
  );
}



function hasDefinition(event, definitionType) {

  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some(d => is(d, definitionType));
}