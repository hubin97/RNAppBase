import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    naviWrapper: {
      position: 'absolute', 
      zIndex: 1000, 
      width: '100%',  
      borderBottomWidth: 0.5
    },
    naviItem: {
      justifyContent: 'center', 
      alignItems: 'center',
    },
    carousel: {
      width: '100%',
      height: 200,
    },
    flatlist: {
      flex: 1, 
    },
    itemWrapper: {
      flexDirection: 'row-reverse', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      //borderBottomWidth: 0.5, 
      minHeight: 60, 
    },
    nextStyle: {
      width: 15, 
      height: 15, 
      marginRight: 15, 
      opacity: 0.5
    },
    contentStyle: {
      flex: 1, 
      padding: 10, 
    },
    bottomStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
  });
  