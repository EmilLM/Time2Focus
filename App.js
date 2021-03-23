import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform} from 'react-native';
import Focus from './src/features/focus/Focus';
import FocusHistory from './src/features/focus/FocusHistory';
import Timer from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { spacingSizes } from './src/utils/sizes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS = {
  completed: 1,
  cancelled: 0,
};

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [subjectHistory, setSubjectHistory] = useState([]);

  const addSubjectHistoryWithStatus = (subject, status) => {
    setSubjectHistory([
      ...subjectHistory,
      { key: String(subjectHistory.length + 1), subject, status },
    ]);
  };

  console.log('App subj', focusSubject)
  const onClear = () => setSubjectHistory([]);

  const saveSubjectHistory = async () => {
    try {
       await AsyncStorage.setItem('subjectHistory', JSON.stringify(subjectHistory));
     
    } catch (e) {
      console.log(e);
    }
  };
  

  const loadSubjectHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('subjectHistory');
      console.log('history', history);
      if (history && JSON.parse(history).length) {
        setSubjectHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    saveSubjectHistory();
  console.log('App subjHistory', subjectHistory)

  }, [subjectHistory]);
  
  useEffect(() => {
    loadSubjectHistory();
  }, []);



  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addSubjectHistoryWithStatus(focusSubject, STATUS.completed);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addSubjectHistoryWithStatus(focusSubject, STATUS.cancelled);
            setFocusSubject(null);
          }}
        />
      ) : (
        <>
          <Focus setFocusSubject={setFocusSubject} />
          <FocusHistory
            subjectHistory={subjectHistory}
            onClear={() => onClear()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: Platform.OS === 'ios' ? spacingSizes.md : spacingSizes.lg,
    backgroundColor: colors.darkBlue,
  },
});
