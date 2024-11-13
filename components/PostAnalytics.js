import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnalyticsPie from './AnalyticsPie';

function PostAnalytics(props) {
  const [votedOption, setVotedOption] = useState(
    props.postAndDetails.sessionUserVote?.option,
  );
  const [postStats, setPostStats] = useState(props.postAndDetails.postStats);

  const showAllVotersFn = () => {
    props.showVoters(true, null, props.postAndDetails.post.postId, null);
  };

  const showThisVotersFn = () => {
    props.showVoters(
      false,
      props.postAndDetails.post.options[0],
      props.postAndDetails.post.postId,
      props.postAndDetails.post.options[0].id,
    );
  };

  const showThatVotersFn = () => {
    props.showVoters(
      false,
      props.postAndDetails.post.options[1],
      props.postAndDetails.post.postId,
      props.postAndDetails.post.options[1].id,
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
      }}>
      <>
        {postStats && (
          <>
            <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 16}}>
              Results and Analysis
            </Text>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 12,
                paddingBottom: 0,
                borderColor: '#EFEFEF',
                borderWidth: 1,
              }}>
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}>
                  <Pressable
                    onPress={showAllVotersFn}
                    style={{flexDirection: 'column', marginRight: 40}}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 24,
                        lineHeight: 30,
                      }}>
                      {postStats.totalVotes}
                    </Text>
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 14,
                        color: '#676767',
                      }}>
                      Total Votes
                    </Text>
                  </Pressable>

                  {(votedOption === null ||
                    votedOption === undefined ||
                    (votedOption.title !== null &&
                      votedOption.title !== undefined &&
                      votedOption.title.trim() !== '')) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      {votedOption ? (
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            lineHeight: 22,
                            flexWrap: 'wrap',
                            textAlign: 'right',
                          }}>
                          You voted for{' '}
                          <Text style={{fontWeight: '600'}}>
                            {votedOption.title}
                          </Text>
                        </Text>
                      ) : (
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            lineHeight: 22,
                            flexWrap: 'wrap',
                            textAlign: 'right',
                          }}>
                          You have not voted yet
                        </Text>
                      )}
                      <Ionicons
                        style={{marginLeft: 15}}
                        name={votedOption ? 'heart' : 'heart-outline'}
                        size={24}
                        color="#FF0000"
                      />
                    </View>
                  )}
                </View>
                <View
                  style={{flex: 1, flexDirection: 'row', marginVertical: 20}}>
                  <View style={{}}>
                    <AnalyticsPie
                      series={[
                        postStats.options[0].totalOptionCount,
                        postStats.options[1].totalOptionCount,
                      ]}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      paddingLeft: 24,
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      onPress={showThisVotersFn}
                      style={{minWidth: 100}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: 0,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#EB961E',
                            height: 14,
                            width: 14,
                            borderRadius: 7,
                            marginRight: 6,
                            position: 'relative',
                            top: 1.5,
                          }}></View>
                        <Text style={{fontWeight: '700', fontSize: 22}}>
                          {postStats.options[0].totalOptionCount}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 14,
                          color: '#454545',
                        }}>
                        {props.postAndDetails.post.options[0].title || 'This'}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={showThatVotersFn}
                      style={{minWidth: 100}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: 0,
                          marginTop: 20,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#05E281',
                            height: 14,
                            width: 14,
                            borderRadius: 7,
                            marginRight: 6,
                            position: 'relative',
                            top: 1.5,
                          }}></View>
                        <Text style={{fontWeight: '700', fontSize: 22}}>
                          {postStats.options[1].totalOptionCount}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 14,
                          color: '#454545',
                        }}>
                        {props.postAndDetails.post.options[1].title || 'That'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View
                  style={{
                    paddingVertical: 20,
                    flex: 1,
                    flexDirection: 'row',
                    borderColor: '#EFEFEF',
                    borderTopWidth: 1,
                  }}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          marginRight: 12,
                          padding: 6,
                          backgroundColor: '#0000FF',
                          borderRadius: 6,
                        }}>
                        <Ionicons name={'male'} size={28} color="#FFFFFF" />
                      </View>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{fontWeight: '700', fontSize: 22}}>
                          {postStats.totalVotesMale}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '500',
                            fontSize: 14,
                            color: '#343434',
                          }}>
                          Males
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#EB961E',
                          height: 16,
                          width: 16,
                          borderRadius: 8,
                          marginRight: 6,
                        }}></View>
                      <Text>{postStats.options[0].optionCountMale}</Text>
                      <View
                        style={{
                          backgroundColor: '#05E281',
                          height: 16,
                          width: 16,
                          borderRadius: 8,
                          marginLeft: 20,
                          marginRight: 6,
                        }}></View>
                      <Text>{postStats.options[1].optionCountMale}</Text>
                    </View>
                  </View>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontWeight: '700', fontSize: 22}}>
                          {postStats.totalVotesFemale}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '500',
                            fontSize: 14,
                            color: '#343434',
                          }}>
                          Females
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: 12,
                          padding: 6,
                          backgroundColor: '#F542B3',
                          borderRadius: 6,
                        }}>
                        <Ionicons name={'female'} size={28} color="#FFFFFF" />
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 10,
                        justifyContent: 'flex-end',
                      }}>
                      <View
                        style={{
                          backgroundColor: '#EB961E',
                          height: 16,
                          width: 16,
                          borderRadius: 8,
                          marginRight: 6,
                        }}></View>
                      <Text>{postStats.options[0].optionCountFemale}</Text>
                      <View
                        style={{
                          backgroundColor: '#05E281',
                          height: 16,
                          width: 16,
                          borderRadius: 8,
                          marginLeft: 20,
                          marginRight: 6,
                        }}></View>
                      <Text>{postStats.options[1].optionCountFemale}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </>
    </View>
  );
}

export default PostAnalytics;
