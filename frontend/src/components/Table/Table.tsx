import {
  ForwardRefExoticComponent,
  HTMLProps,
  ReactFragment,
  RefAttributes,
} from "react";
import { Link, LinkProps } from "react-router-dom";
import { ITableData } from "../../config/types";
import { tablePopulate } from "../../utils/helpers";
import classes from "./table.module.scss";

const Table = ({
  colHeaders,
  data,
  isAction,
  onAddUpload,
  onEditUser,
  onEditUpload,
  onDelete,
  onRemoveShareUser,
  onShare,
  onUserSharer,
  currentUser,
  tableName,
}: any) => {
  const renderEditUserAction = (
    id: String
  ): ForwardRefExoticComponent<
    LinkProps & RefAttributes<HTMLAnchorElement>
  > => {
    return onEditUser && <Link to={`/edit-user/${id}`}>Edit</Link>;
  };

  const renderEditUploadAction = (
    id: string,
    label: string
  ): HTMLProps<HTMLParagraphElement> => {
    return (
      onEditUpload && (
        <p
          className={classes.pointer}
          onClick={() => onEditUpload({ id, label })}
        >
          Edit
        </p>
      )
    );
  };

  const renderDeleteAction = (
    id: string
  ): HTMLProps<HTMLSpanElement & HTMLParagraphElement> & ReactFragment => {
    return (
      onDelete && (
        <>
          <span className={classes.actionSeparator}>|</span>
          <p
            className={
              currentUser === JSON.stringify(id)
                ? classes.disabledAction
                : classes.pointer
            }
            onClick={() => onDelete(id)}
          >
            Delete
          </p>
        </>
      )
    );
  };

  const renderRemoveShareAction = (
    id: string
  ): HTMLProps<HTMLSpanElement & HTMLButtonElement> & ReactFragment => {
    return (
      onRemoveShareUser && (
        <>
          <span className={classes.actionSeparator}>|</span>
          <button className="action" onClick={() => onRemoveShareUser(id)}>
            Remove
          </button>
        </>
      )
    );
  };

  const renderToShareAction = (
    id: string
  ): HTMLProps<HTMLSpanElement> &
    ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>> &
    ReactFragment => {
    return (
      onShare && (
        <>
          <span className={classes.actionSeparator}>|</span>
          <Link to={`/share/${id}`}>Share</Link>
        </>
      )
    );
  };

  const renderUploadSharer = (email: string) => {
    return onUserSharer && <p>{email}</p>;
  };

  const renderActionsColumn = (id: string, label: string, email: string) => {
    return (
      isAction && (
        <td className={classes.tableActions}>
          {renderEditUserAction(id)}
          {renderEditUploadAction(id, label)}
          {renderToShareAction(id)}
          {renderRemoveShareAction(id)}
          {renderDeleteAction(id)}
          {renderUploadSharer(email)}
        </td>
      )
    );
  };

  const tableData = tablePopulate<ITableData>(data);

  return (
    <div className={classes.relative}>
      <table className={classes.globalTable}>
        <thead>
          <tr>
            {colHeaders.map((columnTitle: string, index: number) => {
              return <th key={index}>{columnTitle}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item: ITableData, index: number) => {
            return item ? (
              <tr key={item.id}>
                <td>{item.name || item.label}</td>
                {(item.email || item.fileName) && (
                  <td>
                    {item.email || (
                      <a
                        href={`http://localhost:8888/download/${item.fileLocation}`}
                      >
                        {item.fileName}
                      </a>
                    )}
                  </td>
                )}
                {renderActionsColumn(
                  item.id,
                  item?.label as string,
                  item?.user?.email as string
                )}
              </tr>
            ) : (
              <tr key={index}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                {tableName !== "sharedUploadTable" && <td>&nbsp;</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      {onAddUpload && (
        <button className={classes.uploadButton} onClick={() => onAddUpload()}>
          + Add Upload
        </button>
      )}
    </div>
  );
};

export default Table;
