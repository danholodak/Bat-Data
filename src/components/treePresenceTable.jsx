import * as React from 'react';
import { useTable } from 'react-table'

/**
 * 
 * @param {*} parks is an object mapping park names (strings) to an object
 * The object has 2 fields - "trees" and "bats", each of which is an object containing a field named "count"
 * e.g.
 * 
 * {
    "PBP": {
        "bats": {
            "MYOLUC": {
                "count": 1
            },
            "LASNOC": {
                "count": 2
            }
        },
        "trees": {
            "Black cherry": {
                "count": 1
            },
            "Sweet Gum": {
                "count": 3
            }
        }
    },
    "Astoria": {
        "bats": {
            "EPTFUS": {
                "count": 2
            }
        },
        "trees": {}
    },
 * 
 */
const getRows = (parks) => { 
    console.log("parks", parks);
    const parkNames = Object.keys(parks);
    console.log("parkNames", parkNames);
    // convert from parks with counts of trees to trees with counts of park
    const treePresences = {};
    parkNames.forEach(parkName => {
        Object.keys(parks[parkName].trees).forEach(tree => {
            const standardizedName = tree.toLowerCase().replaceAll(" ", "");
            if (!(standardizedName in treePresences)) {
                treePresences[standardizedName] = {};
            }
            treePresences[standardizedName][parkName] = parks[parkName].trees.count;
        })
    });
    // so now we have an obj like {"sweetgum": {"PBP": 3}, "blackcherry": {"PBP": 1}};
    console.log("treePresences", treePresences);
    // okay lol that was cute but it's completely not what i need goshhh.

    const fieldLoggedTreeNames = Object.keys(treePresences);
    console.log("fieldLoggedTreeNames", fieldLoggedTreeNames);
    // not sure if i want to use my input/trees.json as source of truth, or what's in the input
    // i think we should identify any tree names in the input that aren't in soure of truth, and classify as other
    const knownTrees = require("../input/knownTrees.json");
    console.log("knownTrees", knownTrees);
    const knownTreeNames = Object.keys(knownTrees);
    console.log("knownTreeNames", knownTreeNames);

    const unknownTreeNames = fieldLoggedTreeNames
        .filter(fieldLoggedTreeName => 
            !knownTreeNames.some(knownTreeName => 
                knownTreeName.replaceAll(" ", "").localeCompare(fieldLoggedTreeName.replaceAll(" ", ""))));
    console.log("unknownTrees", unknownTreeNames);

    const totalSetOfTreeNames = new Set(knownTreeNames.concat(unknownTreeNames));

    // so now we have to take our set of names and combine that with the park info and the treeCounts
    const rows = [];
    totalSetOfTreeNames.forEach(treeName => {
        // for each park 
        const genus = knownTreeNames.includes(treeName) ? knownTrees[treeName] : "";
        const row = {genus: genus, commonName: treeName};
        parkNames.forEach(parkName => row[parkName] = 0);
        const standardizedName = treeName.toLowerCase().replaceAll(" ", "");
        if (standardizedName in treePresences) {
            Object.keys(treePresences[standardizedName]).forEach(parkName => {
               row[parkName] = 1; 
            });
        }
        rows.push(row);
    })
    // so now we have a list like
    // [{genus: "Quercus", commonName: "White Oak", PBP: 1, Astoria: 0}, {}, {}]
    console.log("rows", rows);
    return rows;
}

function MyTable({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({
      columns,
      data,
    })
  
    // Render the UI for your table
    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
  

export default function TreePresenceTable({parks}) {
    const rows = getRows(parks);
    const parkNames = Object.keys(parks);
    
      const headers = [{
        Header: 'Genus',
        accessor: 'genus'
      }, {
        Header: 'Common Name',
        accessor: 'commonName'
      }]
      parkNames.forEach(parkName => {
        headers.push({Header: parkName, accessor: parkName});
      })

      return (
        <MyTable columns={headers} data={rows} />
    );
}