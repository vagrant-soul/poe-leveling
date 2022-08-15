import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaGithub,
  FaMap,
  FaRegClipboard,
  FaTools,
  FaUndoAlt,
} from "react-icons/fa";
import styles from "./Navbar.module.css";
import {
  buildRouteSelector,
  useClearGemProgress,
  useClearRouteProgress,
} from "../../utility/ExileSyncStore";
import { useRecoilCallback } from "recoil";

interface NavbarItemProps {
  label: string;
  icon?: React.ReactNode;
  expand: boolean;
  onClick: () => void;
}

function NavbarItem({ label, expand, icon, onClick }: NavbarItemProps) {
  return (
    <div
      onClick={onClick}
      className={classNames(styles.navItem, styles.navElement, {
        [styles.expand]: expand,
      })}
    >
      {icon} {label}
    </div>
  );
}

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [navExpand, setNavExpand] = useState<boolean>(false);
  const navigate = useNavigate();

  const clipboardRoute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const route = await snapshot.getPromise(buildRouteSelector);
        navigator.clipboard.writeText(JSON.stringify(route));
      },
    []
  );
  const clearRouteProgress = useClearRouteProgress();
  const clearGemProgress = useClearGemProgress();

  const acts = [];
  for (let i = 1; i <= 10; i++) {
    acts.push(
      <NavbarItem
        key={i}
        label={`Act ${i}`}
        expand={navExpand}
        onClick={() => {
          navigate(`/#act-${i}`);
          setNavExpand(false);
        }}
      />
    );
  }

  return (
    <div
      className={classNames(styles.navbar, {
        [styles.expand]: navExpand,
      })}
    >
      <div
        className={classNames(styles.navHolder, {
          [styles.expand]: navExpand,
        })}
      >
        <FaBars
          className={classNames(styles.navIcon)}
          onClick={() => setNavExpand(!navExpand)}
          display="block"
        />
        <hr
          className={classNames(styles.seperator, {
            [styles.expand]: navExpand,
          })}
        />
        <div
          className={classNames(styles.navMain, styles.navItems, {
            [styles.expand]: navExpand,
          })}
        >
          <NavbarItem
            label="路线"
            expand={navExpand}
            icon={<FaMap className={classNames("inlineIcon")} />}
            onClick={() => {
              navigate("/");
              setNavExpand(false);
            }}
          />
          <NavbarItem
            label="BD导入"
            expand={navExpand}
            icon={<FaTools className={classNames("inlineIcon")} />}
            onClick={() => {
              navigate("/build");
              setNavExpand(false);
            }}
          />
          <NavAccordion
            label="章节"
            navExpand={navExpand}
            className={classNames(styles.navItem, {
              [styles.expand]: navExpand,
            })}
          >
            {acts}
          </NavAccordion>
          <NavbarItem
            label="重置进程"
            expand={navExpand}
            icon={<FaUndoAlt className={classNames("inlineIcon")} />}
            onClick={() => {
              clearRouteProgress();
              clearGemProgress();
              setNavExpand(false);
            }}
          />
          <NavbarItem
            label="常规路线"
            expand={navExpand}
            icon={<FaRegClipboard className={classNames("inlineIcon")} />}
            onClick={() => {
              clipboardRoute();
              setNavExpand(false);
            }}
          />
          <NavbarItem
            label="QQ频道反馈"
            expand={navExpand}
            icon={<FaGithub className={classNames("inlineIcon")} />}
            onClick={() => {
              window
                .open("https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W4pmrF&appChannel=share&businessType=9&from=246610&biz=ka", "_blank")
                ?.focus();
              setNavExpand(false);
            }}
          />
        </div>
      </div>
      <hr />
    </div>
  );
}

interface NavAccordionProps {
  label: string;
  navExpand: boolean;
}

function NavAccordion({
  label,
  navExpand,
  children,
  onClick,
  ...rest
}: NavAccordionProps & React.HTMLProps<HTMLDivElement>) {
  const [accordionExpand, setAccordionExpand] = useState<boolean>(false);

  useEffect(() => {
    setAccordionExpand(false);
  }, [navExpand]);

  return (
    <div
      onClick={(e) => {
        setAccordionExpand(!accordionExpand);
        if (onClick) onClick(e);
      }}
      {...rest}
    >
      <div className={classNames(styles.navElement)}>{label}</div>
      <hr
        className={classNames(styles.seperator, {
          [styles.expand]: accordionExpand,
        })}
      />
      <div
        className={classNames(styles.navAccordion, styles.navItems, {
          [styles.expand]: accordionExpand,
        })}
      >
        {children}
      </div>
    </div>
  );
}
