import TextFieldEntry from '@bpmn-io/properties-panel/src/components/entries/TextFieldEntry';
import { useService } from 'bpmn-js-properties-panel';

export default function PropertiesView(props) {
  const {
    element
  } = props;

  const commandStack = useService('commandStack');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: element.businessObject,
      properties: {
        'custom:assignee': value
      }
    });
  };

  const getValue = () => {
    return element.businessObject.get('custom:assignee') || '';
  };

  return (
    <div className="bio-properties-panel">
      <TextFieldEntry
        id="assignee"
        label="Assignee"
        getValue={ getValue }
        setValue={ setValue }
      />
    </div>
  );
}
