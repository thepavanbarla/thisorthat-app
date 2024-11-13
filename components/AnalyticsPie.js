import React from 'react';
import {Dimensions} from 'react-native';

import PieChart from 'react-native-pie-chart';

const windowWidth = Dimensions.get('window').width;

function AnalyticsPie(props) {
  const {series} = props;
  const sum = props.series[0] + props.series[1];

  const sliceColor = ['#EB961E', '#05E281'];
  return (
    <PieChart
      widthAndHeight={windowWidth / 2.5}
      series={sum > 0 ? series : [1, 1]}
      doughnut={true}
      sliceColor={sliceColor}
    />
  );
}

export default AnalyticsPie;
