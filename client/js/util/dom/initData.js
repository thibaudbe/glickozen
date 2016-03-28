import readData from './readDataFromDOM';

/* Cache init data; Only depend on this module if you need to read data that never changes */
export default readData('init_data');