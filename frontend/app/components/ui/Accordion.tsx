import * as React from "react";
import { forwardRef } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "../styles/accordion.module.css";

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  value: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, value }) => (
  <Accordion.Item
    className={`${title == "State Template Code" ? styles["AccordionLockedItem"] : ""} ${
      styles["AccordionItem"]
    } `}
    value={value}
  >
    <AccordionTrigger>{title}</AccordionTrigger>
    <AccordionContent>{content}</AccordionContent>
  </Accordion.Item>
);

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, forwardedRef) => (
    <Accordion.Header className={styles["AccordionHeader"]}>
      <Accordion.Trigger className={styles["AccordionTrigger"]} {...props} ref={forwardedRef}>
        {children}
        <ChevronDownIcon className={styles["AccordionChevron"]} aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, ...props }, forwardedRef) => (
    <Accordion.Content className={styles["AccordionContent"]} {...props} ref={forwardedRef}>
      <div className={styles["AccordionContextText"]}>{children}</div>
    </Accordion.Content>
  )
);
AccordionContent.displayName = "AccordionContent";

export default AccordionItem;
