import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

export const useTour = (
  section?: "billing" | "tenant" | "contract" | "expense"
) => {
  const tBilling = useTranslations("tour.billing");
  const tTenant = useTranslations("tour.tenant");
  const tContract = useTranslations("tour.contract");
  const tExpense = useTranslations("tour.expense");

  const startBillingTour = useCallback(
    (options?: { onFinish?: () => void }) => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#billing-tabs",
            popover: {
              title: tBilling("steps.tabs.title"),
              description: tBilling("steps.tabs.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tab-recurring",
            popover: {
              title: tBilling("steps.recurring.title"),
              description: tBilling("steps.recurring.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tab-usage-based",
            popover: {
              title: tBilling("steps.usageBased.title"),
              description: tBilling("steps.usageBased.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tab-merged",
            popover: {
              title: tBilling("steps.merged.title"),
              description: tBilling("steps.merged.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#billing-view-mode",
            popover: {
              title: tBilling("steps.viewToggle.title"),
              description: tBilling("steps.viewToggle.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#billing-filter",
            popover: {
              title: tBilling("steps.filter.title"),
              description: tBilling("steps.filter.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#create-bill-button",
            popover: {
              title: tBilling("steps.create.title"),
              description: tBilling("steps.create.popover"),
              side: "bottom",
              align: "start",
              onNextClick: () => {
                const btn = document.querySelector(
                  "#create-bill-button"
                ) as HTMLButtonElement;
                if (btn) btn.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 500);
              },
            },
          },
          {
            element: "#billing-form-from",
            popover: {
              title: tBilling("steps.formFrom.title"),
              description: tBilling("steps.formFrom.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#billing-form-to",
            popover: {
              title: tBilling("steps.formTo.title"),
              description: tBilling("steps.formTo.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#billing-form-type",
            popover: {
              title: tBilling("steps.formType.title"),
              description: tBilling("steps.formType.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#billing-form-utilities",
            popover: {
              title: tBilling("steps.formUtilities.title"),
              description: tBilling("steps.formUtilities.popover"),
              side: "top",
              align: "start",
            },
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("tour-billing-completed", "true");
          options?.onFinish?.();
          driverObj.destroy();
          window.dispatchEvent(new Event("tour-updated"));
        },
      });

      driverObj.drive();
    },
    [tBilling]
  );

  const startTenantTour = useCallback(
    (options?: { onFinish?: () => void }) => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tenant-view-mode",
            popover: {
              title: tTenant("steps.viewToggle.title"),
              description: tTenant("steps.viewToggle.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tenant-filter",
            popover: {
              title: tTenant("steps.filter.title"),
              description: tTenant("steps.filter.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#add-tenant-button",
            popover: {
              title: tTenant("steps.add.title"),
              description: tTenant("steps.add.popover"),
              side: "bottom",
              align: "start",
            },
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("tour-tenant-completed", "true");
          options?.onFinish?.();
          driverObj.destroy();
          window.dispatchEvent(new Event("tour-updated"));
        },
      });

      driverObj.drive();
    },
    [tTenant]
  );

  const startContractTour = useCallback(
    (options?: { onFinish?: () => void }) => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#contract-status-filter",
            popover: {
              title: tContract("steps.statusFilter.title"),
              description: tContract("steps.statusFilter.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#contract-view-mode",
            popover: {
              title: tContract("steps.viewToggle.title"),
              description: tContract("steps.viewToggle.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#add-contract-button",
            popover: {
              title: tContract("steps.add.title"),
              description: tContract("steps.add.popover"),
              side: "bottom",
              align: "start",
              onNextClick: () => {
                const btn = document.querySelector(
                  "#add-contract-button"
                ) as HTMLButtonElement;
                if (btn) btn.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 500);
              },
            },
          },
          {
            element: "#contract-form-tenants",
            popover: {
              title: tContract("steps.formTenants.title"),
              description: tContract("steps.formTenants.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#contract-form-start",
            popover: {
              title: tContract("steps.formStart.title"),
              description: tContract("steps.formStart.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#contract-form-end",
            popover: {
              title: tContract("steps.formEnd.title"),
              description: tContract("steps.formEnd.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#contract-form-rent",
            popover: {
              title: tContract("steps.formRent.title"),
              description: tContract("steps.formRent.popover"),
              side: "bottom",
              align: "start",
            },
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("tour-contract-completed", "true");
          options?.onFinish?.();
          driverObj.destroy();
          window.dispatchEvent(new Event("tour-updated"));
        },
      });

      driverObj.drive();
    },
    [tContract]
  );

  const startExpenseTour = useCallback(
    (options?: { onFinish?: () => void }) => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#expense-view-mode",
            popover: {
              title: tExpense("steps.viewToggle.title"),
              description: tExpense("steps.viewToggle.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#expense-filter",
            popover: {
              title: tExpense("steps.filter.title"),
              description: tExpense("steps.filter.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#add-expense-button",
            popover: {
              title: tExpense("steps.add.title"),
              description: tExpense("steps.add.popover"),
              side: "bottom",
              align: "start",
              onNextClick: () => {
                const btn = document.querySelector(
                  "#add-expense-button"
                ) as HTMLButtonElement;
                if (btn) btn.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 500);
              },
            },
          },
          {
            element: "#expense-form-handed-over",
            popover: {
              title: tExpense("steps.formHandedOver.title"),
              description: tExpense("steps.formHandedOver.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#expense-form-name",
            popover: {
              title: tExpense("steps.formName.title"),
              description: tExpense("steps.formName.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#expense-form-amount",
            popover: {
              title: tExpense("steps.formAmount.title"),
              description: tExpense("steps.formAmount.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#expense-form-date",
            popover: {
              title: tExpense("steps.formDate.title"),
              description: tExpense("steps.formDate.popover"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#expense-form-add-multiple",
            popover: {
              title: tExpense("steps.formAddMultiple.title"),
              description: tExpense("steps.formAddMultiple.popover"),
              side: "bottom",
              align: "start",
            },
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("tour-expense-completed", "true");
          options?.onFinish?.();
          driverObj.destroy();
          window.dispatchEvent(new Event("tour-updated"));
        },
      });

      driverObj.drive();
    },
    [tExpense]
  );

  useEffect(() => {
    if (!section) return;

    const runTour = () => {
      if (section === "tenant") {
        const isSeen = localStorage.getItem("tour-tenant-completed");
        if (!isSeen) {
          setTimeout(startTenantTour, 1000);
        }
      }

      if (section === "billing") {
        const isTenantSeen = localStorage.getItem("tour-tenant-completed");
        const isBillingSeen = localStorage.getItem("tour-billing-completed");
        if (isTenantSeen && !isBillingSeen) {
          setTimeout(startBillingTour, 1000);
        }
      }

      if (section === "contract") {
        const isBillingSeen = localStorage.getItem("tour-billing-completed");
        const isContractSeen = localStorage.getItem("tour-contract-completed");
        if (isBillingSeen && !isContractSeen) {
          setTimeout(startContractTour, 1000);
        }
      }

      if (section === "expense") {
        const isContractSeen = localStorage.getItem("tour-contract-completed");
        const isExpenseSeen = localStorage.getItem("tour-expense-completed");
        if (isContractSeen && !isExpenseSeen) {
          setTimeout(startExpenseTour, 1000);
        }
      }
    };

    runTour();

    window.addEventListener("tour-updated", runTour);
    return () => window.removeEventListener("tour-updated", runTour);
  }, [
    section,
    startBillingTour,
    startTenantTour,
    startContractTour,
    startExpenseTour,
  ]);

  return {
    startBillingTour,
    startTenantTour,
    startContractTour,
    startExpenseTour,
  };
};
