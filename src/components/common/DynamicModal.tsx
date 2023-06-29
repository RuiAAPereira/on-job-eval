type ModalProps = {
  show: boolean;
  icon: React.ReactNode | null;
  title: string;
  children: React.ReactNode;
};

export const DynamicModal: React.FC<ModalProps> = ({
  show,
  icon,
  title,
  children,
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 outline-none  focus:outline-none">
        <div className=" relative inset-x-0 bottom-0 z-50 mx-4 mb-4 w-1/2 rounded-lg bg-white p-4">
          <div className="items-center md:flex">
            {icon ? (
              <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center">
                {icon}
              </div>
            ) : null}
            <div className="mt-4 w-full text-center md:ml-6 md:mt-0 md:text-left">
              <p className="mb-4 font-bold">{title}</p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
