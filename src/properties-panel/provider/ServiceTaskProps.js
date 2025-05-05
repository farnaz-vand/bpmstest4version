import { TextFieldEntry } from '@bpmn-io/properties-panel';

export function ServiceTaskProps(group, element, bpmnFactory) {
  if (element.type !== 'bpmn:ServiceTask') return;

  group.entries.push({
    id: 'assignee',
    component: AssigneeEntry
  });
}

function AssigneeEntry(props) {
  const { element, id } = props;

  const value = element.businessObject.get('custom:assignee') || '';

  const setValue = (value) => {
    element.businessObject.set('custom:assignee', value);
  };

  return TextFieldEntry({
    element,
    id,
    label: 'Assignee',
    getValue: () => value,
    setValue
  });
}
