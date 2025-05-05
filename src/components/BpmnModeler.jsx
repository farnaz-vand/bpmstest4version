import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';

import BpmnPropertiesPanelModule from 'bpmn-js-properties-panel';
import BpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

const BpmnModeler = () => {
  const bpmnModelerRef = useRef(null);
  const canvasRef = useRef(null);
  const propertiesPanelRef = useRef(null);

  useEffect(() => {
    const modeler = new BpmnJS({
      container: canvasRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });

    bpmnModelerRef.current = modeler;
    modeler.createDiagram();
  }, []);

  const createEvent = async (type, eventDefinitionType, baseType = 'bpmn:StartEvent') => {
    const modeler = bpmnModelerRef.current;
    const elementFactory = modeler.get('elementFactory');
    const modeling = modeler.get('modeling');
    const canvas = modeler.get('canvas');
    const moddle = modeler.get('moddle');

    const businessObject = moddle.create(baseType, { name: type });

    if (eventDefinitionType) {
      const eventDefinition = moddle.create(eventDefinitionType);
      businessObject.eventDefinitions = [eventDefinition];
    }

    const shape = elementFactory.createShape({
      type: baseType,
      businessObject
    });

    modeling.createShape(shape, { x: Math.random() * 600 + 100, y: Math.random() * 300 + 100 }, canvas.getRootElement());
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div ref={canvasRef} style={{ flex: 3, border: '1px solid #ccc' }} />
      <div ref={propertiesPanelRef} style={{ width: '300px', borderLeft: '1px solid #ccc' }} />

      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <h4>Add Events</h4>
        <button onClick={() => createEvent('StartEvent', null, 'bpmn:StartEvent')}>Start Event</button>
        <button onClick={() => createEvent('StartTimerEvent', 'bpmn:TimerEventDefinition', 'bpmn:StartEvent')}>Start Timer</button>
        <button onClick={() => createEvent('StartMessageEvent', 'bpmn:MessageEventDefinition', 'bpmn:StartEvent')}>Start Message</button>
        <button onClick={() => createEvent('StartSignalEvent', 'bpmn:SignalEventDefinition', 'bpmn:StartEvent')}>Start Signal</button>
        <button onClick={() => createEvent('StartConditionalEvent', 'bpmn:ConditionalEventDefinition', 'bpmn:StartEvent')}>Start Conditional</button>
        <br /><br />
        <button onClick={() => createEvent('EndEvent', null, 'bpmn:EndEvent')}>End Event</button>
        <button onClick={() => createEvent('MessageEndEvent', 'bpmn:MessageEventDefinition', 'bpmn:EndEvent')}>End Message</button>
        <button onClick={() => createEvent('ErrorEndEvent', 'bpmn:ErrorEventDefinition', 'bpmn:EndEvent')}>End Error</button>
        <button onClick={() => createEvent('SignalEndEvent', 'bpmn:SignalEventDefinition', 'bpmn:EndEvent')}>End Signal</button>
        <button onClick={() => createEvent('TerminateEndEvent', 'bpmn:TerminateEventDefinition', 'bpmn:EndEvent')}>End Terminate</button>
        <br /><br />
        <button onClick={() => createEvent('IntermediateTimerEvent', 'bpmn:TimerEventDefinition', 'bpmn:IntermediateCatchEvent')}>Intermediate Timer</button>
        <button onClick={() => createEvent('IntermediateSignalCatchEvent', 'bpmn:SignalEventDefinition', 'bpmn:IntermediateCatchEvent')}>Catch Signal</button>
        <button onClick={() => createEvent('IntermediateSignalThrowEvent', 'bpmn:SignalEventDefinition', 'bpmn:IntermediateThrowEvent')}>Throw Signal</button>
        <button onClick={() => createEvent('IntermediateMessageCatchEvent', 'bpmn:MessageEventDefinition', 'bpmn:IntermediateCatchEvent')}>Catch Message</button>
        <button onClick={() => createEvent('IntermediateMessageThrowEvent', 'bpmn:MessageEventDefinition', 'bpmn:IntermediateThrowEvent')}>Throw Message</button>
        <button onClick={() => createEvent('IntermediateConditionalCatchEvent', 'bpmn:ConditionalEventDefinition', 'bpmn:IntermediateCatchEvent')}>Catch Conditional</button>
      </div>
    </div>
  );
};

export default BpmnModeler;
