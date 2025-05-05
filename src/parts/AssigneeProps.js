import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export function AssigneeProps(group, element) {
  group.entries.push({
    id: 'assignee',
    component: AssigneeEntry,
    isEdited: isTextFieldEntryEdited
  });
}

function AssigneeEntry(props) {
  const { element, id } = props;

  const businessObject = getBusinessObject(element);

  const getValue = () => businessObject.get('custom:assignee') || '';

  const setValue = value => {
    businessObject.set('custom:assignee', value);
  };

  return TextFieldEntry({
    element,
    id,
    label: 'Assignee',
    getValue,
    setValue
  });
}
