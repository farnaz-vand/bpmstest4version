import { RetryProps } from '../parts/RetryProps';
import { AssigneeProps } from '../parts/AssigneeProps';
import { RetryProps } from '../parts/RetryProps';

export default function CustomPropertiesProvider(propertiesPanel) {
  propertiesPanel.registerProvider(800, {
    getGroups: (element) => {
      return (groups) => {
        const generalGroup = groups.find(g => g.id === 'general');

        if (generalGroup && element.type === 'bpmn:ServiceTask') {
          AssigneeProps(generalGroup, element);
          RetryProps(generalGroup, element);
        }

        return groups;
      };
    }
  });
}

CustomPropertiesProvider.$inject = ['propertiesPanel'];
