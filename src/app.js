import React, { useEffect } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import PropertiesPanel from './properties-panel';
import TopicPropertiesPanel from './components/TopicPropertiesPanel';
import customModdleExtension from './moddle/custom.json';
import diagramXML from './diagram.bpmn';
import BpmnEditor from '../src/parts/BpmnEditor';

const $modelerContainer = document.querySelector('#modeler-container');
const $propertiesContainer = document.querySelector('#properties-container');
const $exportButton = document.querySelector('#export-btn');

const modeler = new Modeler({
  container: $modelerContainer,
  keyboard: {
    bindTo: document.body
  },
  moddleExtensions: {
    custom: customModdleExtension
  }
});

new PropertiesPanel({
  container: $propertiesContainer,
  modeler
});

modeler.importXML(diagramXML).then(() => {
  console.log('Diagram loaded');
}).catch(err => {
  console.error('Failed to load diagram:', err);
});

$exportButton.addEventListener('click', async () => {
  try {
    const { xml } = await modeler.saveXML({ format: true });

    console.log('Exported XML:', xml);

    await sendToBackend(xml);
  } catch (err) {
    console.error('Error exporting diagram:', err);
  }
});

async function sendToBackend(xml) {
  try {
    const res = await fetch('https://your-backend.com/api/bpmn/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN' 
      },
      body: JSON.stringify({ xml })
    });

    if (!res.ok) {
      throw new Error('Server error');
    }

    const result = await res.json();
    alert('ارسال موفقیت‌آمیز بود.');
    console.log('Response:', result);
  } catch (err) {
    alert('خطا در ارسال به سرور');
    console.error('Send error:', err);
  }
}

const propertiesPanelContainer = document.querySelector('#properties-container');
ReactDOM.render(<TopicPropertiesPanel modeler={modeler} />, propertiesPanelContainer);

function App() {
  useEffect(() => {
 
  }, []);

  return (
    <div className="App">
      <h1>Welcome to BPMN Editor</h1>
      <BpmnEditor />
    </div>
  );
}

export default App;
