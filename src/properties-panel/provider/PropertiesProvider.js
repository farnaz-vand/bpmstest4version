import { AssigneeProps } from "../AssigneeProps"
import { ServiceTaskProps } from './ServiceTaskProps'; // فایل جدید

export default function CustomPropertiesProvider(propertiesPanel) {
    propertiesPanel.registerProvider(800, {
      getGroups: (element) => {
        return (groups) => {
          const generalGroup = groups.find(g => g.id === 'general');
          
          // بررسی برای اضافه کردن ویژگی‌ها به گروه 'general'
          if (generalGroup) {
            AssigneeProps(generalGroup, element);
          }
  
          // بررسی برای اضافه کردن ویژگی‌ها به سرویس تسک‌ها
          if (element.type === 'bpmn:ServiceTask') {
            const serviceTaskGroup = groups.find(g => g.id === 'ServiceTask');
            if (serviceTaskGroup) {
              ServiceTaskProps(serviceTaskGroup, element); // اضافه کردن ویژگی‌ها برای سرویس تسک‌ها
            }
          }
  
          return groups;
        };
      }
    });
  }
  
  CustomPropertiesProvider.$inject = ['propertiesPanel'];
  
