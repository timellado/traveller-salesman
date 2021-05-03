#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

#define MAX_SPLIT 255
#define BUFFER_SIZE 4096

int visited_cities[100], cost = 0;
char return_value[100];

int tsp(int c, int **matrix, int limit)
{
    int count, temp;
    int nearest_city = 999;
    int minimum = 999;
    for (count = 0; count < limit; count++)
    {
        if ((matrix[c][count] > 0) && (visited_cities[count] == 0))
        {
            if (matrix[c][count] < minimum)
            {
                minimum = matrix[count][0] + matrix[c][count];
            }
            temp = matrix[c][count];
            nearest_city = count;
        }
    }
    if (minimum != 999)
    {
        cost = cost + temp;
    }
    return nearest_city;
}

void minimum_cost(int city, int **matrix, int limit)
{
    int nearest_city;
    visited_cities[city] = 1;
    char number_str[20];
    sprintf(number_str, "%d", city + 1);
    strcat(return_value, number_str);
    // printf("%d ", city + 1);
    nearest_city = tsp(city, matrix, limit);
    if (nearest_city == 999)
    {
        nearest_city = 0;
        sprintf(number_str, "%d", nearest_city + 1);
        strcat(return_value, number_str);
        // printf("%d", nearest_city + 1);
        cost = cost + matrix[city][nearest_city];
        return;
    }
    minimum_cost(nearest_city, matrix, limit);
}

static char **split_by_sep(char *str, char *sep)
{
    char **new_str = calloc(MAX_SPLIT, sizeof(char *));
    int index = 0;

    char *token = strtok(str, sep);
    while (token != NULL)
    {
        new_str[index] = calloc(BUFFER_SIZE, sizeof(char));
        strcpy(new_str[index++], token);
        token = strtok(NULL, sep);
    }

    return new_str;
}

char *EMSCRIPTEN_KEEPALIVE calculate_cost(char *input_char)
{
    char** input_array = split_by_sep(input_char, ",");

    int i, j;
    int matrix_len = atoi(input_array[0]);
    int number_lines = atoi(input_array[1]);

    printf("FIRST 2 VALUES %d %d\n", matrix_len, number_lines);

    //matrix init
    int **matrix = (int **)malloc(sizeof(int) * matrix_len);
    for (int i = 0; i < matrix_len; i++)
    {
        matrix[i] = (int *)malloc(matrix_len * sizeof(*matrix[i]));
    }

    for (i = 0; i < matrix_len; i++)
    {
        for (j = 0; j < matrix_len; j++)
        {
            if (i == j)
            {
                matrix[i][j] = 0;
            }
            else
            {
                matrix[i][j] = -1;
            }
        }
    }

    // input file read
    char ***input_file = malloc(sizeof(int *) * matrix_len);
    int lines = 0;
    for (i = 0; i < number_lines; i++)
    {
        input_file[i] = split_by_sep(input_array[i + 2], " ");
    }

    // Matrix build
    while (lines < number_lines)
    {
        // printf("LINES : %d\n", lines);
        int row = atoi(input_file[lines][0]);
        int col = atoi(input_file[lines][1]);
        int val = atoi(input_file[lines][2]);
        // printf("[%d][%d] = [%d]\n", row, col, val);
        matrix[row][col] = val;
        matrix[col][row] = val;
        lines++;
    }

    minimum_cost(0, matrix, matrix_len);
    char cost_str[20];
    sprintf(cost_str, ",%d\n", cost);
    strcat(return_value, cost_str);
    printf("RETURN: %s", return_value);
    // printf("Costo mínimo: %d\n", cost);
    return return_value;
}