import { AssigneeProps } from "../AssigneeProps"
import { ServiceTaskProps } from './ServiceTaskProps';

export default function CustomPropertiesProvider(propertiesPanel) {
    propertiesPanel.registerProvider(800, {
      getGroups: (element) => {
        return (groups) => {
          const generalGroup = groups.find(g => g.id === 'general');
          
          if (generalGroup) {
            AssigneeProps(generalGroup, element);
          }
  
          if (element.type === 'bpmn:ServiceTask') {
            const serviceTaskGroup = groups.find(g => g.id === 'ServiceTask');
            if (serviceTaskGroup) {
              ServiceTaskProps(serviceTaskGroup, element); 
            }
          }
  
          return groups;
        };
      }
    });
  }
  
  CustomPropertiesProvider.$inject = ['propertiesPanel'];
  
