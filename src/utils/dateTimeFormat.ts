import moment from 'moment';

const formatDateTime = (date?: Date) => {
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export default formatDateTime;
