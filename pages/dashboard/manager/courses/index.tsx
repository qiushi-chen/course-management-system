import storage from '@/lib/service/storage';
import { Button, List, Spin } from 'antd';
import Link from 'next/link';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Course, CourseRequest, CourseResponse } from '@/lib/model';
import { useListEffect } from '@/hooks/list.effect';
import apiService from '@/lib/service/api.service';
import { Indicator } from '@/components/common/styled';
import DashboardLayout from '@/components/dashboard.layout';
import CourseOverview from '@/components/course/overview';
import BackTop from '@/components/common/back.top';

export function ScrollMode() {
  const { paginator, setPaginator, hasMore, data } = useListEffect<
    CourseRequest,
    CourseResponse,
    Course
  >(apiService.getCourses.bind(apiService), 'courses', false);

  const loadMoreData = () => {
    console.log('paginator ====', paginator);
    setPaginator({ ...paginator, page: paginator.page + 1 });
  };

  return (
    <>
      <InfiniteScroll
        next={loadMoreData}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size='large' />
          </Indicator>
        }
        dataLength={data.length}
        endMessage={<Indicator>No More Course!</Indicator>}
        scrollableTarget='content-layout'
        style={{ overflow: 'hidden' }}>
        <List
          id='container'
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}>
                <Link
                  href={`/dashboard/${storage.role()}/courses/${item.id}`}
                  passHref>
                  <Button type='primary'>Read More</Button>
                </Link>
              </CourseOverview>
            </List.Item>
          )}></List>
      </InfiniteScroll>
      <BackTop />
    </>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <ScrollMode />
    </DashboardLayout>
  );
}
