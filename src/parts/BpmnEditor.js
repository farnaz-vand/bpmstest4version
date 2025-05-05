import React, { useEffect, useRef } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler'; 

const BpmnEditor = () => {
  const canvasRef = useRef(null);
  const modelerRef = useRef(null);

  useEffect(() => {
    modelerRef.current = new BpmnModeler({
      container: canvasRef.current,
    });

    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ...>
        <!-- XML بیزینس پروسس -->
      </bpmn:definitions>`;
    
    modelerRef.current.importXML(sampleXML, (err) => {
      if (err) {
        console.error('Error while importing BPMN XML:', err);
      }
    });
  }, []);

  const downloadBpmnFile = () => {
    modelerRef.current.saveXML({ format: true }, function (err, xml) {
      if (err) {
        console.error('Error while saving BPMN XML:', err);
        return;
      }

      const blob = new Blob([xml], { type: 'application/xml' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'process.bpmn'; 
      link.click(); 
    });
  };

  return (
    <div>
      <div ref={canvasRef} style={{ width: '100%', height: '600px' }}></div>
      <button onClick={downloadBpmnFile}>Download BPMN File</button>
    </div>
  );
};

export default BpmnEditor;
