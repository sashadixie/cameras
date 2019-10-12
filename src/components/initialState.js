const initialState = {
  items: [{
    id: 1,
    name: 'first floor',
    cams: [
      {
        id: 1,
        src: 'https://via.placeholder.com/250',
      },
      {
        id: 2,
        src: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        src: 'https://via.placeholder.com/350',
      },
    ],
  },
  {
    id: 2,
    name: 'second floor',
    cams: [
      {
        id: 1,
        src: 'https://via.placeholder.com/450',
        isPrivate: true,
      },
      {
        id: 2,
        src: 'https://via.placeholder.com/550',
      },
    ],
  }],
  activeTab: 0,
};

initialState.fullImage = initialState.items[0].cams[0].src;
export default initialState;
