/**
 * 2007-2017 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2017 PrestaShop SA
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

import TableSorting from '../../app/utils/table-sorting';
import ConfirmationAlert from '../../components/confirmation-alert';
import Grid from '../../components/grid';

const $ = window.$;

class SqlManagerPage {
  constructor() {
    const $sortableTables = $('table.table');

    new Grid('#request_sql_grid_panel').init();
    new TableSorting($sortableTables).attach();
    new ConfirmationAlert().init();

    $(document).on('change', '.js-db-tables-select', () => this.reloadDbTableColumns());
    $(document).on('click', '.js-add-db-table-to-query-btn', (event) => this.addDbTableToQuery(event));
    $(document).on('click', '.js-add-db-table-column-to-query-btn', (event) => this.addDbTableColumnToQuery(event));
  }

  /**
   * Reload database table columns
   */
  reloadDbTableColumns() {
    const $selectedOption = $('.js-db-tables-select').find('option:selected');

    $.ajax($selectedOption.data('table-columns-url'))
      .then((response) => {
        $('.js-table-alert').addClass('d-none');

        const columns = response.columns;

        const $table = $('.js-table-columns');
        $table.removeClass('d-none');
        $table.find('tbody').empty();

        columns.forEach((column) => {
          const $row = $('<tr>')
            .append($('<td>').html(column.name))
            .append($('<td>').html(column.type))
            .append($('<td>').addClass('text-right')
              .append($('<button>')
                .addClass('btn btn-sm btn-outline-secondary js-add-db-table-column-to-query-btn')
                .attr('data-column', column.name)
                .html($table.data('action-btn'))
              )
            );

          $table.find('tbody').append($row);
        });
      });
  }

  /**
   * Add selected database table name to SQL query input
   *
   * @param event
   */
  addDbTableToQuery(event) {
    const $selectedOption = $('.js-db-tables-select').find('option:selected');

    if ($selectedOption.length === 0) {
      alert($(event.target).data('choose-table-message'));

      return;
    }

    this.addToQuery($selectedOption.val());
  }

  /**
   * Add table column to SQL query input
   *
   * @param event
   */
  addDbTableColumnToQuery(event) {
    const column = $(event.target).data('column');

    this.addToQuery(column);
  }

  /**
   * Add data to SQL query input
   *
   * @param {String} data
   */
  addToQuery(data) {
    const $queryInput = $('#form_request_sql_sql');
    $queryInput.val($queryInput.val() + ' ' + data);
  }
}

$(document).ready(() => {
  new SqlManagerPage();
});
