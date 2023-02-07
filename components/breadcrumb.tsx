import { Role } from '@/constants/role';
import { routes, SideNav } from '@/constants/routes';
import { useUserRole } from '@/hooks/login.state';
import { searchDFSPathFactory } from '@/lib/util/search.dfs';
import { getSideNavNameByPath } from '@/lib/util/side.nav';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AppBreadcrumb = () => {
  const router = useRouter();
  const path = router.route;
  const paths = path.split('/').slice(1);
  const root = '/' + paths.slice(0, 2).join('/');
  const userRole = useUserRole();
  const sideNav = routes.get(userRole as Role);
  const names = getSideNavNameByPath(sideNav, path) || [];

  return (
    <Breadcrumb style={{ margin: '0 1rem', padding: '1rem' }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userRole.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>

      {names.map((name, index) => {
        if (name === 'Detail') {
          return <Breadcrumb.Item key={index}>Detail</Breadcrumb.Item>;
        }

        const path = searchDFSPathFactory<SideNav>(
          (nav: SideNav, target: any) => nav.label === target,
          name,
          'subNav'
        )(sideNav, []);

        const { paths } = path.reduce(
          (sum, cur) => {
            const item = sum.source[sum.source.length + cur];
            return { source: item.subNav, paths: [...sum.paths, item] };
          },
          { source: sideNav, paths: [] }
        );

        const isText =
          index === names.length - 1 ||
          paths.every((item) => item.hideLinkInBreadcrumb);

        const subPath = paths
          .map((item) => item.path)
          .reduce((acc, cur) => [...acc, ...cur], [])
          .filter((item) => !!item)
          .join('/');

        return (
          <Breadcrumb.Item key={index}>
            {isText ? name : <Link href={`${root}/${subPath}`}>{name}</Link>}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
