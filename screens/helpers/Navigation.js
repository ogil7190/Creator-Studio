import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

export const goInitializing = () => Navigation.setRoot({
    root: {
        stack: {
          id: 'Initializing Screen',
          children: [
            {
              component: {
                name: 'Initializing Screen',
                options: {
                  topBar: {
                    visible: false,
                    drawBehind: true,
                  }
                }
              }
            },
        ],
        }
      }
});

const archive = {
  id: 'archive',
  component: {
    name: 'home.ArchiveIcon'
  }
};

const create_event = {
  id: 'create_event',
  component: {
    name: 'home.CreateEventIcon'
  }
}

const helpStory = {
  id: 'help_story',
  component: {
    name: 'story.HelpIcon'
  }
};

const settings = {
  id: 'settings',
  component: {
    name: 'settings.Icon'
  }
};

const doneStory = {
  id: 'done_story',
  component: {
    name: 'story.DoneIcon'
  }
};

export const goHome = async () => {
  const homeIcon = await Icon1.getImageSource('home', 24);
  const createIcon = await Icon.getImageSource('pluscircle', 24);
  const profileIcon = await Icon2.getImageSource('user-tie', 24);

  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              id: "Home Stack",
              options: {
                // topBar: {
                //   visible: false,
                //   drawBehind: true,
                // },
                bottomTab: {
                  fontSize: 10,
                  selectedFontSize: 12,
                  text: 'Home',
                  icon: homeIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#514A9D'
                },
              },
              children: [
                {
                  component: {
                    name: 'Home Screen',
                    options: {
                      topBar: {
                        visible: true,
                        animate: true,
                        background: {
                          color: '#fff',
                          component: {
                            name: 'homeTopBar'
                          }
                        },
                        rightButtons : [create_event]
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            stack: {
              id: "Create Stack",
              options: {
                // topBar: {
                //   visible: false,
                //   drawBehind: true,
                // },
                bottomTab: {
                  fontSize: 10,
                  selectedFontSize: 12,
                  text: 'Story',
                  icon: createIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#514A9D'
                },
              },
              children: [
                {
                  component: {
                    name: 'Story Screen',
                    options: {
                      topBar: {
                        visible: true,
                        animate: true,
                        background: {
                          color: '#fff',
                          component: {
                            name: 'homeTopBar',
                          }
                        },
                        rightButtons : [doneStory]
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            stack: {
              id: "Profile Stack",
              options: {
                // topBar: {
                //   visible: false,
                //   drawBehind: true,
                // },
                bottomTab: {
                  fontSize: 10,
                  selectedFontSize: 12,
                  text: 'Profile',
                  icon: profileIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#514A9D'
                },
              },
              children: [
                {
                  component: {
                    name: 'Profile Screen',
                    options: {
                      topBar: {
                        visible: true,
                        animate: true,
                        background: {
                          color: '#fff',
                          component: {
                            name: 'homeTopBar'
                          }
                        },
                        rightButtons : [settings]
                      }
                    }
                  }
                }
              ]
            }
          },
        ],
      }
    }
  });
}

// export const goHome = () => ;