import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

export function RetryProps(group, element) {
  if (element.type !== 'bpmn:ServiceTask') return;

  group.entries.push({
    id: 'retryCount',
    component: RetryCountEntry,
    isEdited: isTextFieldEntryEdited
  });
}

function RetryCountEntry(props) {
  const { element, id } = props;

  const value = element.businessObject.get('custom:retryCount') || '';

  const setValue = (value) => {
    element.businessObject.set('custom:retryCount', value);
  };

  return TextFieldEntry({
    element,
    id,
    label: 'Retry Count',
    getValue: () => value,
    setValue
  });
}
