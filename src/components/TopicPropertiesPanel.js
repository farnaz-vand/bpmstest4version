import { useEffect, useState } from 'react';

const TopicPropertiesPanel = ({ modeler }) => {
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    modeler.on('selection.changed', (event) => {
      const { newSelection } = event;
      if (newSelection.length === 1) {
        const element = newSelection[0];
        if (element.businessObject.$type === 'custom:TopicHolder') {
          setSelectedElement(element);
        }
      }
    });
  }, [modeler]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (selectedElement) {
      selectedElement.businessObject[name] = value;
      modeler.get('elementRegistry').updateGraphics(selectedElement);
    }
  };

  return (
    selectedElement && (
      <div>
        <label>Topic</label>
        <input
          type="text"
          name="topic"
          value={selectedElement.businessObject.topic || ''}
          onChange={handleChange}
        />
      </div>
    )
  );
};

export default TopicPropertiesPanel;
