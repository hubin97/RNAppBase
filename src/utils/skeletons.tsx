import React from 'react';
import { SkeletonBase } from '@/components/ui/SkeletonBase';
import { Rect } from 'react-content-loader/native';
import { Dimensions } from 'react-native';

const { width: kW } = Dimensions.get('window');

// MARK: 常规 图文列表
export const Skeleton_List: React.FC = () => {
  return (
    <SkeletonBase>
      {Array.from({ length: 10 }).flatMap((_, idx) => [
        <Rect key={`list-${idx}-1`} x={15} y={15 + 130 * idx} rx={4} ry={4} width={110} height={110} />,
        <Rect key={`list-${idx}-2`} x={140} y={20 + 130 * idx} width={kW - 160} height={20} />,
        <Rect key={`list-${idx}-3`} x={140} y={55 + 130 * idx} width={60} height={10} />,
        <Rect key={`list-${idx}-4`} x={140} y={75 + 130 * idx} width={kW / 3} height={20} />,
        <Rect key={`list-${idx}-5`} x={140} y={110 + 130 * idx} width={60} height={10} />,
        <Rect key={`list-${idx}-6`} x={kW - 40} y={105 + 130 * idx} rx={10} ry={10} width={20} height={20} />
      ])}
    </SkeletonBase>
  );
};

// MARK: 简易列表
export const Skeleton_List_Simple: React.FC = () => {
  return (
    <SkeletonBase>
      {Array.from({ length: 20 }).map((_, idx) => (
        <Rect key={`simple-${idx}`} x={15} y={15 + 30 * idx} width={(kW - 30) * Math.min(0.8, Math.max(0.4, Math.random()))} height={20} />
      ))}
    </SkeletonBase>
  );
};

// MARK: 项目加载
export const Skeleton_ChildList: React.FC = () => {
  return (
    <SkeletonBase>
      {Array.from({ length: 10 }).flatMap((_, idx) => [
        <Rect key={`child-${idx}-1`} x={15} y={15 + 100 * idx} width={60} height={80} />,
        <Rect key={`child-${idx}-2`} x={80} y={15 + 100 * idx} width={kW - 90} height={30} />,
        <Rect key={`child-${idx}-3`} x={80} y={60 + 100 * idx} width={kW / 2} height={10} />,
        <Rect key={`child-${idx}-4`} x={80} y={80 + 100 * idx} width={kW / 3} height={10} />,
        <Rect key={`child-${idx}-5`} x={kW - 30} y={80 + 100 * idx} width={15} height={15} />
      ])}
    </SkeletonBase>
  );
};

// MARK: 首页加载
export const Skeleton_Home: React.FC = () => {
  return (
    <SkeletonBase>
      {[
        <Rect key="home-header" x={0} y={0} width={kW} height={200} />,
        ...Array.from({ length: 10 }).flatMap((_, idx) => [
          <Rect key={`home-${idx}-1`} x={15} y={210 + 60 * idx} width={kW - 60} height={30} />,
          <Rect key={`home-${idx}-2`} x={15} y={255 + 60 * idx} width={60} height={10} />,
          <Rect key={`home-${idx}-3`} x={kW - 30 - 100 - 15} y={255 + 60 * idx} width={100} height={10} />,
          <Rect key={`home-${idx}-4`} x={kW - 30} y={225 + 60 * idx} width={15} height={15} />
        ])
      ]}
    </SkeletonBase>
  );
};

// MARK: 体系加载
export const Skeleton_Tree: React.FC = () => {
  return (
    <SkeletonBase>
      {Array.from({ length: 20 }).map((_, idx) => (
        idx % 5 === 0 ? (
          <Rect key={`tree-${idx}-main`} x={15} y={15 + 30 * idx} width={kW - 30} height={20} />
        ) : (
          <Rect key={`tree-${idx}-sub`} x={15} y={15 + 30 * idx} width={(kW - 30) / 2} height={20} />
        )
      ))}
    </SkeletonBase>
  );
}; 